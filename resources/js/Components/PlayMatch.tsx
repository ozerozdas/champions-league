import eventBus from '@/eventBus';
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { playAllWeeks, playNextWeek, resetLeague } from "@/Services/api";
import { useState } from 'react';

export default function PlayMatch({ isLeagueCompleted }: { isLeagueCompleted: boolean }) {
    const [leagueCompleted, setLeagueCompleted] = useState(isLeagueCompleted);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handlePlayAll = async () => {
        setLoading(true);
        try {
            const response = await playAllWeeks();
            toast({
                description: "All weeks simulated!",
                duration: 3000
            });

            eventBus.emit('refreshData');
            setLeagueCompleted(response.data.isLeagueCompleted);
        } catch (e) {
            toast({
                title: "Failed to simulate all weeks",
                description: "Please try again later.",
                variant: "destructive",
                duration: 5000
            });
            console.error("Error simulating all weeks:", e);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayNext = async () => {
        setLoading(true);
        try {
            const response = await playNextWeek();
            toast({
                description: "Next week simulated!",
                duration: 3000
            });

            eventBus.emit('refreshData');
            setLeagueCompleted(response.data.isLeagueCompleted);
        } catch (e) {
            toast({
                title: "Failed to simulate next week",
                description: "Please try again later.",
                variant: "destructive",
                duration: 5000
            });
            console.error("Error simulating next week:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        setLoading(true);
        try {
            await resetLeague();
            toast({
                description: "League data reset!",
                duration: 3000
            });

            eventBus.emit('refreshData');
            setLeagueCompleted(false);
        } catch (e) {
            toast({
                title: "Failed to reset league data",
                description: "Please try again later.",
                variant: "destructive",
                duration: 5000
            });
            console.error("Error resetting league data:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 p-4 rounded-lg bg-gray-200/40'>
            <Button className='w-full' variant="default" onClick={handlePlayAll} disabled={leagueCompleted || loading}>Play All Weeks</Button>
            <Button className='w-full' variant="default" onClick={handlePlayNext} disabled={leagueCompleted || loading}>Play Next Week</Button>
            <Button className='w-full' variant="destructive" onClick={handleReset} disabled={loading}>Reset Data</Button>
        </div>
    )
}